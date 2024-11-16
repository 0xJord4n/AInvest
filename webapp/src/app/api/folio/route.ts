import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const INCH_API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
const INCH_API_URL = 'https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20';
// TODO: implementer Value et details 

export async function GET() {
  try {
    const cookieStore = cookies();
    const walletAddress = cookieStore.get('wallet_address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address not found' },
        { status: 401 }
      );
    }

    if (!INCH_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Get current portfolio value
    const currentValueResponse = await fetch(
      `${INCH_API_URL}/overview/erc20/current_value?addresses=${walletAddress.value}&chain_id=8453`,
      {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!currentValueResponse.ok) {
      throw new Error(`1inch API error: ${currentValueResponse.statusText}`);
    }

    const currentValue = await currentValueResponse.json();

    // Get profit and loss data
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const pnlResponse = await fetch(
      `${INCH_API_URL}/overview/erc20/profit_and_loss?addresses=${walletAddress.value}&chain_id=8453&from_timestamp=${thirtyDaysAgo.toISOString()}&to_timestamp=${now.toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!pnlResponse.ok) {
      throw new Error(`1inch API error: ${pnlResponse.statusText}`);
    }

    const pnlData = await pnlResponse.json();

    // Get token details
    const detailsResponse = await fetch(
      `${INCH_API_URL}/overview/erc20/details?addresses=${walletAddress.value}&chain_id=8453`,
      {
        headers: {
          'Authorization': `Bearer ${INCH_API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!detailsResponse.ok) {
      throw new Error(`1inch API error: ${detailsResponse.statusText}`);
    }

    const tokenDetails = await detailsResponse.json();

    // Combine all data
    const portfolioData = {
      currentValue,
      pnlData,
      tokenDetails,
    };

    return NextResponse.json(portfolioData);

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
