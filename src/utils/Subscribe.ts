export async function subscribe(email: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAILER_LITE_TOKEN!}`,
      },
      body: JSON.stringify({
        email: email,
        groups: ["138249619844892538"],
      }),
    });

    if (!res.ok) {
      return {
        err: {
          message:
            "Something went wrong while subscribing to the newsletter. Please try again later.",
        },
      };
    }
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      console.error("Network error: Please check your internet connection.");
      return {
        err: {
          message: "Please check your internet connection.",
        },
      };
    }
    return err;
  }
}
