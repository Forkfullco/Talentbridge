const LOGO_URL = "https://cdn.magicpatterns.com/uploads/mggeWn1Atmj3UTXgeEKhB4/talent-bridge-profile.png";

/** Supplied "tb." mark, used on its own with no wordmark. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={LOGO_URL}
      alt="TalentBridge"
      width={size}
      height={size}
      className="block rounded-[10px] object-cover"
      style={{ width: size, height: size }}
    />
  );
}
