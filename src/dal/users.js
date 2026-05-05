import fs from "fs/promises"
import path from "path"

const filepath = path.join(process.cwd(), "data", "users.json")

async function readFileSafe() {
    try{
        const file = await fs.readFile(filepath, "utf-8")
        const data = JSON.parse(file)

        if(!Array.isArray(data)) return []

        return data;
    } catch(err){
        if(err.code === "ENOENT") {
            await writeFileSafe([])
            return [];
        }
    }
}

async function writeFileSafe(data) {
    try {
        const tempPath = filepath + ".tmp"

        await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8")

        await fs.rename(tempPath, filepath)
    }catch(err) {
    console.error("Error writing file:", err);
    throw new Error("Failed to persist data");
    }
}

export async function getUsers() {
    return await readFileSafe()
}

export async function getUserById(id) {
  const users = await readFileSafe();
  return users.find((u) => u.id === id) || null;
}


export async function createUser(userData){
  const users = await readFileSafe();


  const exists = users.some((u) => u.email === userData.email);
  if (exists) {
    throw new Error("Email already exists");
  }

  const newUser = {
    id: `u_${Date.now()}`, 
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeFileSafe(users);

  return newUser;
}


export async function updateUser(id,updates) {
  const users = await readFileSafe();

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const updatedUser = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updatedUser;

  await writeFileSafe(users);

  return updatedUser;
}


export async function deleteUser(id) {
  const users = await readFileSafe();

  const filtered = users.filter((u) => u.id !== id);

  if (filtered.length === users.length) {
  
    return false;
  }

  await writeFileSafe(filtered);
  return true;
}