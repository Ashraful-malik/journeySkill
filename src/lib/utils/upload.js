export const uploadFile = async (file, folder) => {
  console.log(file);
  const formDate = new FormData();
  formDate.append("file", file);
  formDate.append("folder", folder);
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formDate,
    });
    const data = await res.json();
    if (data.success) {
      console.log("Uploaded File URL:", data);
      return data;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
