export const getCreators = (nfts) => {
  if (!nfts || nfts.length === 0) {
    return [];
  }

  const creatorsMap = nfts.reduce((creators, nft) => {
    const { seller, price } = nft;
    creators[seller] = creators[seller] || { sum: 0, seller };
    creators[seller].sum += Number(price);
    return creators;
  }, {});

  const creatorsArray = Object.values(creatorsMap).sort((a, b) => b.sum - a.sum);

  return creatorsArray;
};
