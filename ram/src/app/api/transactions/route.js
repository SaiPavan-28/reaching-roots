import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Transaction from '@/models/Transaction';
import Farmer from '@/models/Farmer';
import VLE from '@/models/VLE';
import mongoose from 'mongoose';

/**
 * GET /api/transactions
 * Fetches transaction history. Single source of truth filtered by farmerId or vleId.
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const farmerParam = searchParams.get('farmerId');
    const vleParam = searchParams.get('vleId');
    const statusParam = searchParams.get('status');

    const query = {};

    if (statusParam) {
      query.status = statusParam.toUpperCase();
    }

    if (farmerParam) {
      if (mongoose.Types.ObjectId.isValid(farmerParam)) {
        query.farmerId = farmerParam;
      } else {
        const foundFarmer = await Farmer.findOne({ farmerId: farmerParam });
        if (foundFarmer) query.farmerId = foundFarmer._id;
        else return NextResponse.json({ success: true, count: 0, data: [] });
      }
    }

    if (vleParam) {
      if (mongoose.Types.ObjectId.isValid(vleParam)) {
        query.vleId = vleParam;
      } else {
        const foundVLE = await VLE.findOne({ vleId: vleParam });
        if (foundVLE) query.vleId = foundVLE._id;
        else return NextResponse.json({ success: true, count: 0, data: [] });
      }
    }

    const transactions = await Transaction.find(query)
      .populate({
        path: 'farmerId',
        select: 'farmerId fullName mobileNumber villageId',
        populate: {
          path: 'villageId',
          select: 'villageId name',
        },
      })
      .populate('vleId', 'vleId fullName mobileNumber centerName villageId')
      .populate('machineryId', 'machineryId name category rateDescription')
      .populate('requestId', 'requestId requiredDate quantityOrArea status')
      .sort({ date: -1, createdAt: -1 });

    const totalAmount = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      summary: {
        totalTransactions: transactions.length,
        totalAmount,
      },
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching transactions' },
      { status: 500 }
    );
  }
}
