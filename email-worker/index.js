import { processReminders } from "../functions/mail.js";

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(processReminders(env));
  },
};
