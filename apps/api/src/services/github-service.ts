export async function fetchRepositoryMetadata(fullName: string) {
  return {
    fullName,
    defaultBranch: "main",
    language: "TypeScript"
  };
}
