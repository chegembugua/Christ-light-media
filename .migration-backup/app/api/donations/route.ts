/**
 * app/api/donations/route.ts
 * GET: list user's donations (authenticated users)
 * POST: create donation (authenticated users)
 * [Stripe integration would be handled here in production]
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  parsePagination,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const { page, pageSize, skip } = parsePagination(request);
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = { userId: authResult.user.id };
    if (type) where.type = type;
    if (status) where.status = status;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.donation.count({ where }),
    ]);

    return successResponse(donations, 200, { page, pageSize, total });
  } catch (error) {
    console.error('GET /api/donations error:', error);
    return errorResponse('Failed to fetch donations', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const { amount, type, project, currency } = body;

    if (!amount || !type) {
      return errorResponse('Amount and type are required', 400);
    }

    if (amount <= 0) {
      return errorResponse('Amount must be greater than 0', 400);
    }

    // In production: integrate Stripe here
    // For now, create a pending donation record

    const donation = await prisma.donation.create({
      data: {
        userId: authResult.user.id,
        amount,
        type,
        project: project || null,
        currency: currency || 'USD',
        status: 'PENDING',
      },
    });

    // TODO: Call Stripe API to create payment intent
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({...});

    return successResponse({
      donation,
      message: 'Donation created (payment integration pending)',
    }, 201);
  } catch (error) {
    console.error('POST /api/donations error:', error);
    return errorResponse('Failed to create donation', 500);
  }
}
