export const getMapHrefByPlaceId = (placeName: string, placeId: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        placeName
    )}&place_id=${placeId}`;
};
