import { describe, it, expect, beforeEach, vi } from 'vitest';

import {hashPassword, verifyPassword} from "@src/utils/passwordHash.js"

describe("hashPassword", async () => {
    let hash;
    const password = "P@assw0rd!";
    beforeEach(async () => {
        hash = await hashPassword(password);
    });
    it("produces a string", () => expect(typeof hash).toBe("string"));
    it("changes the password", () => expect(hash).not.toBe(password));
    it("produces different hashes from the same password", async () => {
        const hash2 = await hashPassword(password);
        expect(hash).not.toBe(hash2);
    })
});

describe("verifyPassword", async () => {
    let hash;
    const password = "P@assw0rd!";
    beforeEach(async () => {
        hash = await hashPassword(password);
    });
    it("be true for the same password", async () => {
        const result = await verifyPassword(password, hash);
        expect(result).toBe(true);
    });
    it("be false for a different password", async () => {
        const result = await verifyPassword("a"+ password, hash);
        expect(result).toBe(false);
    });
});