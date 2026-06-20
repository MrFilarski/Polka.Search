// Curated Unsplash photo IDs per category — deterministic pick by name hash
const CATEGORY_PHOTOS: Record<string, string[]> = {
  restaurant: [
    'photo-1517248135467-4c7edcad34c4', // restaurant interior
    'photo-1555396273-367ea4eb4db5', // food table
    'photo-1414235077428-338989a2e8c0', // fine dining
    'photo-1559339352-11d035aa65de', // restaurant ambience
    'photo-1424847651672-bf20a4b0982b', // restaurant night
    'photo-1466978913421-dad2ebd01d17', // restaurant warm
    'photo-1550966871-3ed3cdb5ed0c', // modern restaurant
    'photo-1476224203421-9ac39bcb3327', // food close
  ],
  cafe: [
    'photo-1501339847302-ac426a4a7cbb', // cafe interior
    'photo-1442512595331-e89e73853f31', // coffee cup
    'photo-1495474472287-4d71bcdd2085', // latte art
    'photo-1447933601403-0c6688de566e', // coffee beans
    'photo-1521017432531-fbd92d768814', // cozy cafe
    'photo-1509042239860-f550ce710b93', // cappuccino
    'photo-1461023058943-07fcbe16d735', // cafe window
    'photo-1515442261605-65987783cb6a', // coffee shop
  ],
  bar: [
    'photo-1572116469696-31de0f17cc34', // bar counter
    'photo-1543007630-9710e4a00a20', // cocktails
    'photo-1470337458703-46ad1756a187', // bar night
    'photo-1536935338788-846bb9981813', // bartender
    'photo-1514362545857-3bc16c4c7d1b', // whiskey bar
    'photo-1528823872057-9c018a7a7553', // cocktail glass
    'photo-1559628233-100c798642d0', // bar shelves
    'photo-1578662996442-48f60103fc96', // pub interior
  ],
  museum: [
    'photo-1554907984-15263bfd63bd', // museum hall
    'photo-1518998053901-5348d3961a04', // art museum
    'photo-1565060169194-19fabf63012a', // sculpture
    'photo-1577083552431-6e5fd01988ec', // gallery
    'photo-1531243269054-e1d5a18b6ab5', // ancient art
    'photo-1504197832061-98356e3dcdcf', // museum interior
    'photo-1524230659092-07f99a4e0527', // exhibition
    'photo-1547891654-e66ed7ebb968', // modern art
  ],
  park: [
    'photo-1519331379826-f10be5486c6f', // city park
    'photo-1568605114967-8130f3a36994', // green park
    'photo-1588392382834-a891154bca4d', // park bench
    'photo-1444464666168-49d633b86797', // park lake
    'photo-1506905925346-21bda4d32df4', // park nature
    'photo-1502082553048-f009c37129b9', // park trees
    'photo-1441974231531-c6227db76b6e', // forest path
    'photo-1540206395-68808572332f', // park fountain
  ],
  fitness: [
    'photo-1534438327276-14e5300c3a48', // gym weights
    'photo-1571019613454-1cb2f99b2d8b', // fitness class
    'photo-1517836357463-d25dfeac3438', // workout
    'photo-1548690312-e3b507d8c110', // gym interior
    'photo-1540497077202-7c8a3999166f', // lifting
    'photo-1574680096145-d05b474e2155', // cardio
    'photo-1581009137042-c552e485697a', // gym equipment
    'photo-1561214115-f2f134cc4912', // yoga
  ],
  shop: [
    'photo-1567401893414-76b7b1e5a7a5', // shopping mall
    'photo-1441986300917-64674bd600d8', // store front
    'photo-1472851294608-062f824d29cc', // retail shop
    'photo-1555529669-e69e7aa0ba9a', // boutique
    'photo-1581291518857-4e27b48ff24e', // fashion store
    'photo-1560169897-fc0cdbdfa4d5', // supermarket
    'photo-1586880244406-556ebe35f282', // grocery
    'photo-1542838132-92c53300491e', // market
  ],
  hotel: [
    'photo-1566073771259-6a8506099945', // hotel lobby
    'photo-1445019980597-93fa8acb246c', // hotel room
    'photo-1587213811864-c02d74af1f03', // hotel pool
    'photo-1551882547-ff40c4fe1962', // hotel exterior
    'photo-1618773928121-c32242e63f39', // hotel bed
    'photo-1561501900-3701fa6a0864', // resort
    'photo-1631049307264-da0ec9d70304', // luxury hotel
    'photo-1520250497591-112f2f40a3f4', // hotel view
  ],
  church: [
    'photo-1548533923-4efb5b3c3d32', // church interior
    'photo-1596627116790-af6f46dddbad', // gothic church
    'photo-1568283096533-078a0ea6c788', // church facade
    'photo-1543968996-ee822b8176ba', // cathedral
    'photo-1578589314786-b3ff3ab70f96', // church tower
    'photo-1512232723894-36d0efbad6b6', // chapel
    'photo-1523908511403-7fc7b25592f4', // old church
    'photo-1542814257-5336c8c8b35b', // monastery
  ],
  school: [
    'photo-1580582932707-520aed937b7b', // school building
    'photo-1546410531-bb4caa6b424d', // classroom
    'photo-1524178232363-1fb2b075b655', // university
    'photo-1427504494785-3a9ca7044f45', // library
    'photo-1509062522246-3755977927d7', // study room
    'photo-1456735190827-d1262f71b8a3', // campus
    'photo-1503676260728-1c00da094a0b', // lecture hall
    'photo-1519452575417-564c1401ecc0', // school yard
  ],
  pharmacy: [
    'photo-1584308666744-24d5c474f2ae', // pharmacy
    'photo-1563213126-a4273aed2016', // medicine
    'photo-1471864190281-a93a3070b6de', // pills
    'photo-1631549916768-4119b4220eb0', // drugstore
    'photo-1587370560942-ad2a04eabb6d', // health
    'photo-1576091160550-2173dba999ef', // medical
    'photo-1559757175-0eb30cd8c063', // healthcare
    'photo-1628595351029-c2bf17511435', // clinic
  ],
  default: [
    'photo-1477959858617-67f85cf4f1df', // city warsaw
    'photo-1519677100203-a0e668c92439', // warsaw old town
    'photo-1465447142348-e9952c393450', // city street
    'photo-1534430480872-3498386e7856', // urban life
    'photo-1444723121867-7a241cacace9', // city buildings
    'photo-1449824913935-59a10b8d2000', // city night
    'photo-1480714378408-67cf0d13bc1b', // city downtown
    'photo-1486325212027-8081e485255e', // urban street
  ],
};

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function categoryKey(category: string, tags: string[] = []): string {
  const text = (category + ' ' + tags.join(' ')).toLowerCase();
  if (text.includes('restaur') || text.includes('food') || text.includes('sushi') || text.includes('pizza') || text.includes('jedzenie')) return 'restaurant';
  if (text.includes('kawiarni') || text.includes('cafe') || text.includes('coffee') || text.includes('kawa')) return 'cafe';
  if (text.includes('bar') || text.includes('pub') || text.includes('cocktail') || text.includes('drink')) return 'bar';
  if (text.includes('muzeum') || text.includes('museum') || text.includes('galeria') || text.includes('gallery')) return 'museum';
  if (text.includes('park') || text.includes('garden') || text.includes('ogród')) return 'park';
  if (text.includes('fitness') || text.includes('gym') || text.includes('siłowni') || text.includes('sport')) return 'fitness';
  if (text.includes('sklep') || text.includes('shop') || text.includes('store') || text.includes('market') || text.includes('handel')) return 'shop';
  if (text.includes('hotel') || text.includes('hostel') || text.includes('apartament')) return 'hotel';
  if (text.includes('kościół') || text.includes('church') || text.includes('katedra') || text.includes('cathedral')) return 'church';
  if (text.includes('school') || text.includes('szkol') || text.includes('uczelni') || text.includes('universit')) return 'school';
  if (text.includes('apteka') || text.includes('pharmac') || text.includes('health')) return 'pharmacy';
  return 'default';
}

export function getPlaceImage(name: string, category: string, tags: string[] = [], width = 640, height = 360): string {
  const key = categoryKey(category, tags);
  const photos = CATEGORY_PHOTOS[key] ?? CATEGORY_PHOTOS.default;
  const idx = nameHash(name) % photos.length;
  const photoId = photos[idx];
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=75`;
}
