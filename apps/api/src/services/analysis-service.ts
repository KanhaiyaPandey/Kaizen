import OpenAI from "openai";

export async function summarizeRepository(openai: OpenAI, repositoryName: string) {
  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `Provide a concise contributor-focused summary for the repository ${repositoryName}.`
  });

  return completion.output_text;
}
