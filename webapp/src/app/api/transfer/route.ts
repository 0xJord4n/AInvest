import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const INCH_API_KEY = process.env.INCH_API_KEY;
const HISTORY_API_URL = 'https://api.1inch.dev/history/v2.0/history';

export async function GET() {
  try {
    const cookieStore = cookies();
    const walletAddress = (await cookieStore).get('wallet_address');
    
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

    const historyUrl = `${HISTORY_API_URL}/${walletAddress.value}/events`;
    const historyConfig = {
      headers: {
        Authorization: `Bearer ${INCH_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        limit: '50',
        chainId: '8453'
      }
    };

    const historyResponse = await axios.get(historyUrl, historyConfig);

    if (historyResponse.status !== 200) {
      throw new Error('Failed to fetch history data');
    }

    return NextResponse.json(historyResponse.data);
    
  } catch (error) {
    console.error('API call error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}