import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    const newOrder = orders.map((order) => ({
      id: order._id,
      img: order.img,
      title: order.title,
      price: order.price,
      isCompleted: order.isCompleted,
      messageImage:
        "https://res.cloudinary.com/atm1x/image/upload/v1682322691/message_n60siq.png",
      buyerId: order.buyerId,
      sellerId: order.sellerId,
    }));
    res.status(200).send(newOrder);
  } catch (error) {
    next(error);
  }
};

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const gig = await Gig.findById(req.params.id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.coverImg,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (error) {
    next(err);
  }
};
