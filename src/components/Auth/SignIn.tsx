'use client';

import {useState} from 'react';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

import {SignInFormData} from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {login} from '@/app/actions/auth';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignIn = () => {
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  async function signIn(formData: SignInFormData) {
    const {error} = await login(formData.email, formData.password);

    if (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={SignInSchema}
            onSubmit={signIn}
          >
            {({errors, touched}) => (
              <Form className="flex flex-col">
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

                <Link href="/reset-password" className="link w-full mt-4">
                  Forgot your password?
                </Link>

                <Button className="button-inverse mt-4" type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>

          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        </CardContent>
        <CardFooter>
          <Link href="/sign-up" className="link w-full">
            Don&apos;t have an account? Sign Up.
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
