'use client';

import {useState} from 'react';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

import {FormData} from '@/lib/types';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});
console.log(process?.env?.VERCEL_ENV);

const redirectHost =
  process?.env?.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process?.env?.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : 'http://localhost:3000';

const SignUp = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setSuccessMsg] = useState<null | string>(null);

  async function signUp(formData: FormData) {
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
    } else {
      setSuccessMsg(
        'Success! Please check your email for further instructions.',
      );
    }
  }

  return (
    <Card>
      <CardHeader>Create Account</CardHeader>
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
                className={cn('input', 'my-2', errors.firstName && 'bg-red-50')}
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
                className={cn('input', 'my-2', errors.lastName && 'bg-red-50')}
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
                className={cn('input', 'my-2', errors.email && 'bg-red-50')}
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
                className={cn(
                  'input',
                  'my-2',
                  errors.password && touched.password && 'bg-red-50',
                )}
                id="password"
                name="password"
                type="password"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600">{errors.password}</div>
              ) : null}

              <button className="button-inverse w-full" type="submit">
                Submit
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        {successMsg && <div className="text-black">{successMsg}</div>}
      </CardContent>
      <CardFooter>
        <Link href="/sign-in" className="link w-full">
          Already have an account? Sign In.
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
