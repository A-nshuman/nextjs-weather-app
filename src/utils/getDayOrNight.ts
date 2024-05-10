export function getDayOrNight(
    iconName: string, dateTimeString: string
) {
    const hour = new Date(dateTimeString).getHours();

    const isDay = hour >= 5 && hour < 18;
    
    return isDay ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}