export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const email = data.get('email')?.toString();

    if (!email) {
      return new Response(
        JSON.stringify({ message: "ERROR: NO EMAIL PROVIDED." }),
        { status: 400 }
      );
    }

    const API_KEY = import.meta.env.BUTTONDOWN_API_KEY;

    if (!API_KEY) {
      console.error("Missing BUTTONDOWN_API_KEY");
      return new Response(
        JSON.stringify({ message: "ERROR: SERVER CONFIGURATION." }),
        { status: 500 }
      );
    }

    // Call Buttondown API
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Buttondown API Error:", errorData);
      
      // If the user is already subscribed, Buttondown might return a 400 with a specific error
      if (errorData[0]?.includes("already subscribed")) {
        return new Response(
          JSON.stringify({ message: "YOU ARE ALREADY ON THE LIST." }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ message: "ERROR: FAILED TO SUBSCRIBE." }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "CONFIRMED. YOU ARE ON THE LIST."
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription Exception:", error);
    return new Response(
      JSON.stringify({
        message: "ERROR: INTERNAL SERVER ERROR."
      }),
      { status: 500 }
    );
  }
};
