import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Vérifiez si l'URL demandée est la page d'accueil
  if (request.nextUrl.pathname === "/") {
    // Redirigez vers "/vote"
    return NextResponse.redirect(new URL("/vote", request.url));
  }

  // Si ce n'est pas la page d'accueil, continuez sans redirection
  return NextResponse.next();
}

// Spécifiez les chemins auxquels ce middleware s'applique
export const config = {
  matcher: "/",
};
