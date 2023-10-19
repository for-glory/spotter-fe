export const formatCurrency = (num: number=0, type: string) => {
	if (num < 1e3) {
		if(type === 'normal') {
			return "$"+num.toString();
		} else {
			return "$"+num.toFixed(2).toString();
		}
	} else if (num < 1e6) {
		return "$" + (num / 1e3).toFixed(1) + 'k';
	} else {
		return "$" + (num / 1e6).toFixed(1) + 'M';
	}
};
