window.NamingScenes=(()=>{
 const environments={"home": "ev", "kitchen": "mutfak", "clothes": "giyinme alanı", "care": "banyo", "toys": "oyun alanı", "school": "sınıf", "animals": "hayvanın doğal yaşam alanı", "vehicles": "yol", "food": "mutfak", "plants": "bahçe"};
 const overrides={"shampoo": "duş rafı", "toiletpaper": "banyo", "napkin": "yemek masası", "sponge": "mutfak lavabosu", "broom": "temizlik alanı", "fish": "su altı", "duck": "gölet", "train": "raylar", "plane": "havaalanı veya gökyüzü", "ship": "su", "bicycle": "bisiklet yolu", "cactus": "saksı", "mint": "bahçe toprağı", "basil": "bahçe toprağı"};
 return {image:(id,index=0)=>`./assets/naming/scenes/${id}/${(index%5)+1}.webp`,environment:item=>overrides[item.id]||environments[item.category]};
})();
