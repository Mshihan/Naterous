const stripe = require("stripe");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.checkoutSession = async (req, res) => {
  console.log("checked out");
  const signature = req.headers["stripe-signature"];
  console.log("signature: ", signature);

  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

  console.log("End points: ", endpointSecret);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
    // console.log(event);
  } catch (err) {
    // console.log(err.message);
    res.status(400).json({ error: "Webhook error" });
    //     return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await createBookingCheckout(session);

    res.status(200).json({ received: true });
  }
};

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))
    .id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
};
