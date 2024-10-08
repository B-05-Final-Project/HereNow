import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const GET = async (request: Request) => {
  const supabase = createClient();

  try {
    const response = await supabase
      .from('Feeds')
      .select('*, FeedLikes(feedId), Users(nickname, profileImage)')
      .limit(8);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data from API' },
      { status: 500 },
    );
  }
};
