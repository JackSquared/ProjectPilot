'use client';

import {useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';
import {useRouter} from 'next/navigation';

import {FormData} from '@/lib/types';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignIn = () => {
  const supabase = createClient();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const router = useRouter();

  async function signIn(formData: FormData) {
    const {error} = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    }

    router.push('/');
  }

  return (
    <Card>
      <CardHeader>Sign In</CardHeader>
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
                className={cn(
                  'input',
                  'my-2',
                  errors.email && touched.email && 'bg-red-50',
                )}
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
  );
};

export default SignIn;
