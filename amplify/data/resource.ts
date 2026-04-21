import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Chat: a
    .model({
      name: a.string().required(),
      messages: a.hasMany("Message", "chatId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Message: a
    .model({
      chatId: a.id().required(),
      chat: a.belongsTo("Chat", "chatId"),
      content: a.string().required(),
      createdAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
