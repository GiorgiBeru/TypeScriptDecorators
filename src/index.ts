import { User } from "./modules";

const btn = document.getElementById("btn");
const input = document.getElementById("userId");
const loading = document.getElementById("loading");

const getUserById = (id: number): Promise<User> =>
  new Promise((resolve) => {
    const users = [
      {
        id: 1,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 26,
        isActive: true,
      },
      {
        id: 2,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 27,
        isActive: false,
      },
      {
        id: 3,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 28,
        isActive: true,
      },
    ];
    setTimeout(() => {
      resolve(users.find((u) => u.id == id));
    }, 5000);
  });

function memo(time: number) {
  let myMap = new Map<string, Promise<User>>();

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const id = args[0];
      if (myMap.has(id)) {
        return Promise.resolve(myMap.get(id));
      } else {
        return original.apply(this, args).then((res: any) => {
          myMap.set(id, res);
          setTimeout(() => {
            myMap.delete(id);
          }, time * 1000);
          return res;
        });
      }
    };
  };
}

class UsersService {
  @memo(3) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
}

const usersService = new UsersService();

btn.addEventListener("click", async () => {
  loading.innerHTML = "loading";
  await usersService
    .getUserById(+(input as HTMLInputElement).value)
    .then((x) => console.log(x));
  loading.innerHTML = "";
});
