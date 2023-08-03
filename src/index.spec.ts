import { expose, plainToInstance, transform } from "./index";

describe("Transformer", () => {
  it("should transform an object to an instance", () => {
    const sourceUser = {
      email: "name@email.com",
      first_name: "Name",
      last_name: "Surname",
      user_id: "122343",
    };

    class User {
      @transform((user: typeof sourceUser) => parseInt(user.user_id, 10))
      id: number;

      @transform(
        (user: typeof sourceUser) => `${user.first_name} ${user.last_name}`
      )
      name: string;

      @expose()
      email: string;
    }

    const transformedUser = plainToInstance(sourceUser, User);
    expect(transformedUser).toBeDefined();
    expect(transformedUser).toEqual(
      expect.objectContaining({
        id: 122343,
        name: "Name Surname",
        email: "name@email.com",
      })
    );
  });
});
