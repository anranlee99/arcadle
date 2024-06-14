import Nav from "../islands/Nav.tsx"
import { Head } from "https://deno.land/x/fresh@1.6.3/runtime.ts";
import { FreshContext } from "$fresh/server.ts";

export default function Layout(ctx: FreshContext) {
    return (
      <>
        <Head>
          <meta name="referrer" content="no-referrer-when-downgrade">
          </meta>
        </Head>
        <div class="flex">
            <Nav/>
            <div class="flex-1">
          <ctx.Component />
        </div>
        </div>
      </>
    );
  }