import { useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";
import { getOutfitsForWorld, getOutfitById, OUTFIT_CATALOG } from "./outfitCatalog";

export function ShopUI() {
  const shopOpen = useGame((s) => s.shopOpen);
  const currency = useGame((s) => s.currency);
  const ownedOutfits = useGame((s) => s.ownedOutfits);
  const equippedShirt = useGame((s) => s.equippedShirt);
  const equippedPants = useGame((s) => s.equippedPants);
  const closeShop = useGame((s) => s.closeShop);
  const buyOutfit = useGame((s) => s.buyOutfit);
  const equipOutfit = useGame((s) => s.equipOutfit);
  const unequipAll = useGame((s) => s.unequipAll);

  useEffect(() => {
    if (!shopOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeShop();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [shopOpen, closeShop]);

  if (!shopOpen) return null;

  const outfits = getOutfitsForWorld(shopOpen);
  const worldLabel = shopOpen === "town" ? "Town" : shopOpen === "ocean" ? "Ocean" : "Factory";
  const accentColor = shopOpen === "town" ? "#ff6d00" : shopOpen === "ocean" ? "#00897b" : "#ff9800";

  const sOutfit = equippedShirt ? getOutfitById(equippedShirt) : null;
  const pOutfit = equippedPants ? getOutfitById(equippedPants) : null;
  const sColor = sOutfit ? sOutfit.color : "#4caf50";
  const pColor = pOutfit ? pOutfit.color : "#1a237e";
  const skinColor = "#ffcc80";

  const unboughtOutfits = outfits.filter((item) => !ownedOutfits.includes(item.id));
  const allOwnedItems = OUTFIT_CATALOG.filter((item) => ownedOutfits.includes(item.id));

  const worldLabelMap: Record<string, string> = {
    town: "Town",
    ocean: "Ocean",
    factory: "Factory",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        zIndex: 150,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%)",
          borderRadius: 16,
          padding: "24px 32px",
          width: 560,
          maxHeight: "85vh",
          overflowY: "auto",
          border: `2px solid ${accentColor}40`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}20`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
              {worldLabel} Outfit Shop
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Dress for the occasion!
            </div>
          </div>
          <button
            onClick={closeShop}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(250, 204, 21, 0.1)",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 20,
            border: "1px solid rgba(250, 204, 21, 0.25)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
            <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">$</text>
          </svg>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(250, 204, 21, 0.7)", textTransform: "uppercase", letterSpacing: 1 }}>
              Currency
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#facc15" }}>
              {currency}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Your Avatar
            </div>
            <svg width="64" height="96" viewBox="0 0 64 96">
              <rect x="22" y="0" width="20" height="20" fill={skinColor} />
              <rect x="18" y="24" width="28" height="28" fill={sColor} />
              <rect x="4" y="24" width="14" height="12" fill={sColor} />
              <rect x="46" y="24" width="14" height="12" fill={sColor} />
              <rect x="4" y="36" width="10" height="14" fill={skinColor} />
              <rect x="50" y="36" width="10" height="14" fill={skinColor} />
              <rect x="20" y="52" width="11" height="30" fill={pColor} />
              <rect x="33" y="52" width="11" height="30" fill={pColor} />
              <rect x="18" y="82" width="15" height="8" fill="#555" />
              <rect x="31" y="82" width="15" height="8" fill="#555" />
            </svg>
            <button
              onClick={unequipAll}
              style={{
                marginTop: 8,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                padding: "4px 10px",
                color: "rgba(255,255,255,0.5)",
                fontSize: 9,
                fontWeight: 600,
                cursor: (equippedShirt || equippedPants) ? "pointer" : "default",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                visibility: (equippedShirt || equippedPants) ? "visible" : "hidden",
              }}
            >
              Reset Default
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 0 }}>
            {unboughtOutfits.length > 0 ? (
              unboughtOutfits.map((item) => {
                const canAfford = currency >= item.price;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      padding: "14px 16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: item.color,
                        border: "2px solid rgba(255,255,255,0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                        {item.type}
                      </div>
                    </div>
                    <button
                      onClick={() => buyOutfit(item.id)}
                      disabled={!canAfford}
                      style={{
                        background: canAfford ? "#facc15" : "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        color: canAfford ? "#78350f" : "rgba(255,255,255,0.3)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: canAfford ? "pointer" : "not-allowed",
                        opacity: canAfford ? 1 : 0.6,
                      }}
                    >
                      Buy - {item.price}
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                padding: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
              }}>
                All {worldLabel} outfits purchased!
              </div>
            )}
          </div>
        </div>

        {allOwnedItems.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
              paddingBottom: 8,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
            }}>
              Your Wardrobe
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allOwnedItems.map((item) => {
                const equipped = item.type === "shirt" ? equippedShirt === item.id : equippedPants === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => { if (!equipped) equipOutfit(item.id); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: equipped ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      border: `2px solid ${equipped ? accentColor : "rgba(255,255,255,0.1)"}`,
                      cursor: equipped ? "default" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: item.color,
                        border: "1px solid rgba(255,255,255,0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", lineHeight: 1.2 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                        {worldLabelMap[item.world] || item.world} · {item.type}
                      </div>
                    </div>
                    {equipped && (
                      <div style={{ fontSize: 9, fontWeight: 700, color: accentColor, marginLeft: 4 }}>
                        ON
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 16, textAlign: "center" }}>
          Press Escape to close
        </div>
      </div>
    </div>
  );
}
