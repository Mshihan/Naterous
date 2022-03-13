const stripe = require("stripe");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.checkoutSession = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
  } catch (err) {
    res.status(400).json({ error: "Webhook error" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await createBookingCheckout(session);

    res.status(200).json({ received: true });
  } else {
    res.status(400).json({ object: event.data.object });
  }
};

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))
    .id;
  const price = session.display_items[0].amount / 100;

  await Booking.create({ tour, user, price });
};
