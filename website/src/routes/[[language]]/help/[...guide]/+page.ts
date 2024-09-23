import { getNextGuide, getPreviousGuide } from "$lib/components/docs/docs";

function getModule(language: string | undefined, guide: string) {
    language = language ?? 'en';
    let subguide = undefined;
    if (guide.includes('/')) {
        [guide, subguide] = guide.split('/');
    }
    return subguide
        ? import(`./../../../../lib/docs/${language}/${guide}/${subguide}.mdx`)
        : import(`./../../../../lib/docs/${language}/${guide}.mdx`);
}

export async function load({ params }) {
    const { guide, language } = params;

    const previousGuide = getPreviousGuide(guide);
    const nextGuide = getNextGuide(guide);

    return {
        guideModule: await getModule(language, guide),
        previousGuide,
        previousGuideModule: previousGuide ? getModule(language, previousGuide) : undefined,
        nextGuide,
        nextGuideModule: nextGuide ? getModule(language, nextGuide) : undefined,
    };
}