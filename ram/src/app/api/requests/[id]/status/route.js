import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Request from '@/models/Request';
import Machinery from '@/models/Machinery';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

/**
 * PATCH /api/requests/[id]/status
 * VLE accepts, rejects, or fulfills/completes a farmer machinery request.
 * Enforces atomic stock updates and transaction hooks.
 */
export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { status, rejectionReason, amount, unitsRequested } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required (ACCEPTED, REJECTED, or COMPLETED)' },
        { status: 400 }
      );
    }

    const targetStatus = status.toUpperCase();
    const validStatuses = ['ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(targetStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Resolve Request
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { requestId: id }] };
    } else {
      query = { requestId: id };
    }

    const requestDoc = await Request.findOne(query);
    if (!requestDoc) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    const currentStatus = requestDoc.status;
    const units = Number(unitsRequested) || 1;

    // State machine check
    if (currentStatus === targetStatus) {
      return NextResponse.json(
        { success: true, message: `Request is already in ${targetStatus} status`, data: requestDoc }
      );
    }

    if (currentStatus === 'COMPLETED' || (currentStatus === 'REJECTED' && targetStatus !== 'PENDING')) {
      return NextResponse.json(
        { success: false, error: `Cannot change status of a request that is already ${currentStatus}` },
        { status: 400 }
      );
    }

    let createdTransaction = null;

    // Action 1: Accept Request
    if (targetStatus === 'ACCEPTED') {
      // Concurrency-safe atomic stock decrement
      const updatedMachinery = await Machinery.findOneAndUpdate(
        {
          _id: requestDoc.machineryId,
          availableUnits: { $gte: units },
        },
        {
          $inc: { availableUnits: -units, availableQuantity: -units },
        },
        { new: true }
      );

      if (!updatedMachinery) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot accept request: Requested machinery is currently out of stock or insufficient units available',
          },
          { status: 409 }
        );
      }

      // Update machinery status if availableUnits reaches 0
      if (updatedMachinery.availableUnits === 0) {
        updatedMachinery.status = 'OUT_OF_STOCK';
        await updatedMachinery.save();
      }

      // Create or update associated Transaction record
      let existingTxn = await Transaction.findOne({ requestId: requestDoc._id });
      if (!existingTxn) {
        createdTransaction = new Transaction({
          transactionId: `TXN-${Date.now()}`,
          farmerId: requestDoc.farmerId,
          vleId: requestDoc.vleId,
          machineryId: requestDoc.machineryId,
          requestId: requestDoc._id,
          date: new Date(),
          quantity: requestDoc.quantityOrArea || `${units} Unit(s)`,
          amount: Number(amount) || 0,
          status: 'IN_PROGRESS',
        });
        await createdTransaction.save();
      }

      requestDoc.status = 'ACCEPTED';
      requestDoc.rejectionReason = '';
      await requestDoc.save();
    }

    // Action 2: Reject Request
    else if (targetStatus === 'REJECTED') {
      // If previous status was ACCEPTED, restore inventory
      if (currentStatus === 'ACCEPTED') {
        const restoredMachinery = await Machinery.findByIdAndUpdate(
          requestDoc.machineryId,
          {
            $inc: { availableUnits: units, availableQuantity: units },
          },
          { new: true }
        );

        if (restoredMachinery && restoredMachinery.availableUnits > 0 && restoredMachinery.status === 'OUT_OF_STOCK') {
          restoredMachinery.status = 'AVAILABLE';
          await restoredMachinery.save();
        }

        // Mark associated transaction as CANCELLED
        await Transaction.findOneAndUpdate(
          { requestId: requestDoc._id },
          { status: 'CANCELLED' }
        );
      }

      requestDoc.status = 'REJECTED';
      requestDoc.rejectionReason = rejectionReason || 'Request rejected by VLE';
      await requestDoc.save();
    }

    // Action 3: Complete Request (Fulfill / Return machinery)
    else if (targetStatus === 'COMPLETED') {
      // Restore / finalize available unit count upon service completion
      const restoredMachinery = await Machinery.findByIdAndUpdate(
        requestDoc.machineryId,
        {
          $inc: { availableUnits: units, availableQuantity: units },
        },
        { new: true }
      );

      if (restoredMachinery && restoredMachinery.availableUnits > 0 && restoredMachinery.status === 'OUT_OF_STOCK') {
        restoredMachinery.status = 'AVAILABLE';
        await restoredMachinery.save();
      }

      // Finalize transaction to COMPLETED
      createdTransaction = await Transaction.findOneAndUpdate(
        { requestId: requestDoc._id },
        {
          status: 'COMPLETED',
          amount: amount !== undefined ? Number(amount) : undefined,
        },
        { new: true }
      );

      requestDoc.status = 'COMPLETED';
      await requestDoc.save();
    }

    const populatedRequest = await Request.findById(requestDoc._id)
      .populate('farmerId', 'farmerId fullName mobileNumber villageId')
      .populate('vleId', 'vleId fullName mobileNumber centerName villageId')
      .populate('machineryId', 'machineryId name category rateDescription availableUnits totalUnits status');

    return NextResponse.json({
      success: true,
      message: `Request status updated to ${targetStatus}`,
      data: {
        request: populatedRequest,
        transaction: createdTransaction,
      },
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating request status' },
      { status: 500 }
    );
  }
}
