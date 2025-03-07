import Twitter from 'twitter-lite';

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

export async function postToTwitter(content: string) {
  try {
    const response = await client.post("statuses/update", { status: content });
    return response;
  } catch (error) {
    console.error("Error posting to Twitter:", error);
    throw error;
  }
} 