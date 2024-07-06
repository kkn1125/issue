const Hobby = {
  Guitar: "guitar",
} as const;
type Hobby = (typeof Hobby)[keyof typeof Hobby];

export const inject: {
  name: string;
  age: number;
  hobby: Hobby;
} = {
  name: "test",
  age: 30,
  hobby: "guitar",
};
