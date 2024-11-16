import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';

const INCH_API_KEY = process.env.INCH_API_KEY;
const INCH_API_URL = 'https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20';
const TOKEN_API_URL = 'https://api.1inch.dev/token/v1.2/8453/custom';

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

    const portfolioUrl = `${INCH_API_URL}/details`;
    const portfolioConfig = {
      headers: {
        Authorization: `Bearer ${INCH_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        addresses: walletAddress.value,
        chain_id: '8453',
        timerange: '3years',
        closed: true,
        closed_threshold: 1,
        use_cache: 'false',
      },
    };

    const portfolioResponse = await axios.get(portfolioUrl, portfolioConfig);

    if (portfolioResponse.status !== 200) {
      console.error('Fetch error:', portfolioResponse.status, portfolioResponse.data);
      throw new Error('Failed to fetch portfolio data');
    }

    const tokenAddresses = portfolioResponse.data.result.map((token: any) => token.contract_address);

    console.log(tokenAddresses)
    const tokenDetailsConfig = {
      headers: {
        Authorization: `Bearer ${INCH_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        addresses: tokenAddresses,
      },
    };

    if (!tokenAddresses.length)
      return NextResponse.json({ result: [], total_balance: 0 });


    const tokenDetailsResponse = await axios.get(TOKEN_API_URL, tokenDetailsConfig);

    if (tokenDetailsResponse.status !== 200) {
      console.error('Fetch error:', tokenDetailsResponse.status, tokenDetailsResponse.data);
      throw new Error('Failed to fetch token details');
    }

    const combinedData = portfolioResponse.data.result.map((token: any) => {
      const tokenDetails = tokenDetailsResponse.data[token.contract_address];
      return {
        ...token,
        tokenDetails,
      };
    });

    const totalBalance = Math.floor(combinedData.reduce((sum: number, token: any) => sum + token.value_usd, 0));

    return NextResponse.json({ result: combinedData, total_balance: totalBalance });
  } catch (error) {
    if (error instanceof AxiosError)
      console.log(error.response?.data)
    console.error('API call error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}