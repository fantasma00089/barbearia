import Image, { type ImageProps } from "next/image";
import { isSvg } from "@/lib/utils";

/**
 * next/image que serve SVGs locais e imagens externas sem otimização, e
 * otimiza automaticamente fotos locais/enviadas pelo painel (JPG/WebP/PNG).
 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  // SVG local e URLs externas não passam pelo otimizador (externas exigiriam configurar remotePatterns).
  const external = /^https?:\/\//.test(src);
  return <Image {...props} unoptimized={props.unoptimized ?? (isSvg(src) || external)} alt={props.alt} />;
}
