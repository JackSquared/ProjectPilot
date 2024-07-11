'use client';

import {useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import cn from 'classnames';
import {Field, Form, Formik} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

import {FormData} from '@/lib/types';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignUp = () => {
  const supabase = createClient();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setSuccessMsg] = useState<null | string>(null);

  async function signUp(formData: FormData) {
    const {error} = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
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
            email: '',
            password: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={signUp}
        >
          {({errors, touched}) => (
            <Form className="flex flex-col">
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
