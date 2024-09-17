'use client';

import {useState} from 'react';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

import {SignUpFormData} from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '../ui/button';
import {createClient} from '@/lib/supabase/client';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const redirectHost =
  process?.env?.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://' + process?.env?.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : 'http://localhost:3000';

const SignUp = () => {
  const supabase = createClient();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setSuccessMsg] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function signUp(formData: SignUpFormData) {
    setIsLoading(true);
    const {error} = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${redirectHost}/sign-up/confirm`,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      setSuccessMsg(
        'Success! Please check your email for further instructions.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
            }}
            validationSchema={SignUpSchema}
            onSubmit={signUp}
          >
            {({errors, touched}) => (
              <Form className="flex flex-col">
                <label htmlFor="firstName">First Name</label>
                <Field
                  className={cn('input', 'my-2')}
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  type="text"
                />
                {errors.firstName && touched.firstName ? (
                  <div className="text-red-600">{errors.firstName}</div>
                ) : null}

                <label htmlFor="lastName">Last Name</label>
                <Field
                  className={cn('input', 'my-2')}
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  type="text"
                />
                {errors.lastName && touched.lastName ? (
                  <div className="text-red-600">{errors.lastName}</div>
                ) : null}

                <label htmlFor="email">Email</label>
                <Field
                  className={cn('input', 'my-2')}
                  id="email"
                  name="email"
                  placeholder="jane@acme.com"
                  type="email"
                />
                {errors.email && touched.email ? (
                  <div className="text-red-600">{errors.email}</div>
                ) : null}

                <label htmlFor="email">Password</label>
                <Field
                  className={cn('input', 'my-2')}
                  id="password"
                  name="password"
                  type="password"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-600">{errors.password}</div>
                ) : null}
                <Button
                  className="button-inverse mt-4"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}
          {successMsg && (
            <p className="mt-4 text-black dark:text-white">{successMsg}</p>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/sign-in" className="link w-full">
            Already have an account? Sign In.
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
