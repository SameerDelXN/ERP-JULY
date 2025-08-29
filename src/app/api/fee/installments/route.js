

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Installment from '@/models/installment';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const newInstallment = await Installment.create(body);
    return NextResponse.json({ success: true, data: newInstallment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await connectDB();

  try {
    const installments = await Installment.find().populate('studentId');
    return NextResponse.json({ success: true, data: installments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
