const npmNameRegex = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
export function validFolderName(folderName: string) {
  folderName = folderName?.trim();

  if (folderName.length < 0) {
    throw new Error("❌ Folder names must be at least 3 characters.");
  }

  if (folderName.length > 214) {
    throw new Error("Folder name must be ≤ 214 characters.");
  }

  if (!npmNameRegex.test(folderName)) {
    throw new Error(
      "Invalid folder name. Use only lowercase letters, numbers, hyphens (-), underscores (_), dots (.), or scoped names (@scope/name)."
    );
  }

  return folderName;
}
