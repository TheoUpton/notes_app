import { describe, it, expect, beforeEach, vi } from 'vitest';

import {isValidEmail} from "@src/utils/validation";

describe("isValidEmail", () => {
    it("is false for strings with 0 or multiple @ characters", () => {
        expect(isValidEmail("example.com")).toBe(false);
        expect(isValidEmail("example@test@domain.com")).toBe(false);
    });
    it("is false for strings with a space character(s)", () => {
        expect(isValidEmail(" @sld.tld")).toBe(false);
        expect(isValidEmail("exa mple@sld.tld")).toBe(false);
        expect(isValidEmail("example@ .tld")).toBe(false);
        expect(isValidEmail("example@s ld.tld")).toBe(false);
        expect(isValidEmail("example@sld. ")).toBe(false);
        expect(isValidEmail("example@sld.t ld")).toBe(false);
        expect(isValidEmail(" @ . ")).toBe(false);

    });
    it("is false for strings with more than 255 characters", () => {
        let str = "a".repeat(247) + "@sld.tld";
        expect(isValidEmail(str)).toBe(true);
        str = "a" + str;
        expect(isValidEmail(str)).toBe(false);
    });
    it("is false for strings with no username", () => {
        expect(isValidEmail("@sld.tld")).toBe(false);
    });
    it("is false for strings with no 2nd level domain", () => {
        expect(isValidEmail("example@.tld")).toBe(false);
    });
    it("is false for strings with no top level domain", () => {
        expect(isValidEmail("example@sld.")).toBe(false);
        expect(isValidEmail("example@sld")).toBe(false);
    });
    it("validates 'example@sld.tld'", () => {
        expect(isValidEmail("example@sld.tld")).toBe(true);
    });
});