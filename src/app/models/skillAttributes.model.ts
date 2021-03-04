export class SkillAttributesModel {
    attribute: string | undefined;
    skills: SkillModel[] | undefined;
}

export class SkillModel {
    name: string | undefined;
    rank: string | undefined;
    value: number | undefined;
}
