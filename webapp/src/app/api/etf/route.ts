import { NextRequest, NextResponse } from 'next/server'

type CoinList = {
  [key: string]: string
}

const ETF_LISTS = {
  degen: {
    brett: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    bald: "0xFe20C1B85ABa875EA8cecac8200bF86971968F3A",
    mog: "0x2Da56AcB9Ea78330f947bD57C54119Debda7AF71",
    spx69000: "0x50dA645f148798F68EF2d7dB7C1CB22A6819bb2C",
    miggles: "0xB1a03EdA10342529bBF8EB700a06C60441fEf25d"
  },
  mid: {
    cbBTC: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    aero: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    wEth: "0x4200000000000000000000000000000000000006"
  },
  safe: {
    wEth: "0x4200000000000000000000000000000000000006"
  }
}

export async function GET(request: NextRequest) {
  // Get the profile from searchParams
  const searchParams = request.nextUrl.searchParams
  const profile = searchParams.get('profile')

  // If no profile is specified, return all lists
  if (!profile) {
    return NextResponse.json(ETF_LISTS)
  }

  // If profile is specified, check if it exists
  if (profile in ETF_LISTS) {
    return NextResponse.json(ETF_LISTS[profile as keyof typeof ETF_LISTS])
  }

  // If profile doesn't exist, return error
  return NextResponse.json(
    { error: 'Invalid profile' },
    { status: 400 }
  )
} 