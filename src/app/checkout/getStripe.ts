import {Stripe, loadStripe} from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      'pk_test_51OBinqKJVz8gyV47viLBSt0o88bI6LAoIuaBTPCL8PQq1Pz8sGJzdvTrujUsxIOrlm2i6p1hun2UoAADxm8oeCqA00Pk1NJSPw ',
    );
  }
  return stripePromise;
};

export default getStripe;
