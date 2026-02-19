-- CreateTable
CREATE TABLE "AccessGrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessSession" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ip" TEXT,
    "ua" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "focusX" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "focusY" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessGrant_email_key" ON "AccessGrant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSession_tokenHash_key" ON "AccessSession"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PromptItem_slug_key" ON "PromptItem"("slug");
