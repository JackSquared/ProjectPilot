import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {insertSecret} from '@/app/actions/insertSecret';

const UpdateOpenAIKey = ({userId}: {userId: string}) => {
  const updateApiKey = async (formData: FormData) => {
    'use server';
    const apiKey = formData.get('apiKey') as string;
    await insertSecret(`openai_api_key_${userId}`, apiKey);
  };

  return (
    <form action={updateApiKey} className="space-y-4">
      <Input
        type="password"
        name="apiKey"
        placeholder="Enter your OpenAI API key"
      />
      <Button type="submit">Update API Key</Button>
    </form>
  );
};

export default UpdateOpenAIKey;
