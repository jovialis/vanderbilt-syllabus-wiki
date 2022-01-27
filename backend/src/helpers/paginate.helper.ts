/**
 * Created by jovialis (Dylan Hanson) on 1/25/22.
 */

const DEFAULT_PER_PAGE = 20;

export function paginate<T>(array: T[], curPage: number = 1): T[] {
    if (curPage < 1 || !curPage)
        curPage = 1;

    const start = (curPage - 1) * DEFAULT_PER_PAGE;
    const end = (curPage) * DEFAULT_PER_PAGE;
    return array.slice(start, end);
}