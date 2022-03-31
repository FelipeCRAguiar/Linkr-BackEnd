CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "image" TEXT NOT NULL
);

CREATE TABLE "sessions" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id"),
  "token" TEXT NOT NULL
);

CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id"),
  "link" TEXT NOT NULL,
  "text" TEXT,
  "date" TIMESTAMP WITHOUT TIMEZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "likes" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id"),
  "postId" INTEGER NOT NULL REFERENCES "posts"("id")
);

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL
);

CREATE TABLE "postedTags" (
  "id" SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES "posts"("id"),
  "tagId" INTEGER NOT NULL REFERENCES "tags"("id")
);

CREATE TABLE "followedUsers" (
  "id" SERIAL PRIMARY KEY,
  "followerId" INTEGER NOT NULL REFERENCES "users"("id"),
  "followedId" INTEGER NOT NULL REFERENCES "users"("id")
)

CREATE TABLE "sharedPosts" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id"),
  "postId" INTEGER NOT NULL REFERENCES "posts"("id"),
  "date" TIMESTAMP WITHOUT TIMEZONE NOT NULL DEFAULT NOW()
)

CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "users"("id"),
  "postId" INTEGER NOT NULL REFERENCES "posts"("id"),
  "comment" TEXT NOT NULL
);