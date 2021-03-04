import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AttributesModel } from '../models/attributes.model';
import { CombatAttributesModel } from '../models/combatAttributes.model';
import { SkillAttributesModel } from '../models/skillAttributes.model';
import { AttributesService } from '../services/attributes.service';
import { CombatAttributeService } from '../services/combatAttribute.service';
import { SkillAttributesService } from '../services/skillAttributes.service';
import { RankEnums } from '../shared/Enums/ranks.enum';

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  playerForm = new FormGroup({});
  attributes = Array<AttributesModel>();
  combatAttributes = Array<CombatAttributesModel>();
  skillAttributes = Array<SkillAttributesModel>();
  skillAttributeName = '';
  attribute = '';

  constructor(private attributesService: AttributesService, private combatAttributeService: CombatAttributeService,
    private skillAttributeService: SkillAttributesService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.playerForm = this.fb.group({
      characterName: ['Test Name'],
      strength: [0],
      dexterity: [0],
      mind: [0],
      presence: [0],
      vitality: [0],
      evasion: [0],
      armor: [0],
      alacrity: [0],
      tenacity: [0],
      power: [0],
      damage: [0],
    });
    this.getAttributes();
    this.getCombatAttributes();
    this.getSkillAttributeService();
  }
  // To Get All Attributes
  getAttributes() {
    this.attributesService.getAttributes().subscribe(x => {
      this.attributes = x as AttributesModel[];
    });
  }
  // To Get All Combat Attributes
  getCombatAttributes() {
    this.combatAttributeService.getCombatAttributes().subscribe(x => {
      this.combatAttributes = x as CombatAttributesModel[];
    });
  }
  // To Get All Skill Attributes
  getSkillAttributeService() {
    this.skillAttributeService.getSkillAttributes().subscribe(x => {
      this.skillAttributes = x as SkillAttributesModel[];
    });
  }
  // Calculate Attribute Value And Set
  calculateAttribute(event: any) {
    switch (event.target.getAttribute('data-attributename')) {
      case 'strength':
        this.playerForm.controls.vitality.setValue(3 + parseInt(event.target.value, 10));
        break;
      case 'dexterity':
        const mind = this.playerForm.controls.mind.value;
        const dexterity = parseInt(event.target.value, 10);
        this.playerForm.controls.evasion.setValue(10 + dexterity);
        this.playerForm.controls.armor.setValue(10 + dexterity);
        this.playerForm.controls.alacrity.setValue(parseInt(mind, 10) + dexterity);
        break;
      case 'mind':
        const dexterityMind = this.playerForm.controls.dexterity.value;
        this.playerForm.controls.alacrity.setValue(parseInt(dexterityMind, 10) + parseInt(event.target.value, 10));
        break;
      case 'presence':
        this.playerForm.controls.tenacity.setValue(1 + parseInt(event.target.value, 10));
        break;
    }
  }
  // Calculate Skill Attribute Value And Set
  calculateSkillAttribute(event: any) {
    this.attribute = event.target.getAttribute('data-attributename');
    this.calculateSkillValue(this.attribute);
    this.skillAttributeName = event.target.getAttribute('data-attributeName').toLowerCase();
  }
  // Calculate Skill Attribute Value And Set
  calculateSkillValue(attribute: string) {
    let value = 0;
    switch (attribute) {
      case 'strength':
        value = this.playerForm.controls.strength.value;
        break;
      case 'dexterity':
        value = this.playerForm.controls.dexterity.value;
        break;
      case 'mind':
        value = this.playerForm.controls.mind.value;
        break;
      case 'presence':
        value = this.playerForm.controls.presence.value;
        break;
    }
    const rank = this.getRank(value);
    this.skillAttributes.forEach(skill => {
      if (skill.attribute?.toLowerCase() === attribute) {
        skill.skills?.forEach(skillData => {
          skillData.rank = RankEnums[rank],
            skillData.value = this.getSkillValue(RankEnums[rank], parseInt(rank.toString(), 10));
        });
      }
    });
  }
  // Get Rank Value
  getRank(value: any) {
    if (value >= 40 && value < 50) {
      return RankEnums.Expert;
    } else
      if (value >= 30 && value < 40) {
        return RankEnums.Adept;
      } else
        if (value >= 20 && value < 30) {
          return RankEnums.Apprentice;
        } else
          if (value >= 10 && value < 20) {
            return RankEnums.Novice;
          } else
            if (value < 10) {
              return RankEnums.Untrained;
            }
    return RankEnums.Master;
  }
  // Get Skill Random Value
  getSkillValue(rankName: string, rank: number) {
    let level = 0;
    if (rankName === 'Untrained') {
      level = Math.min(
        this.randomIntFromInterval(1, 20),
        this.randomIntFromInterval(1, 20)
      );
    } else {
      level = this.randomIntFromInterval(1, 20) + this.randomIntFromInterval(1, 4 + 2 * (rank - 1));
    }
    return level;
  }
  // Generate Random Number
  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  // Refresh Skill Attribute Value
  RefreshSkillValue() {
    this.calculateSkillValue(this.attribute);
  }
  // Calculate Damage and Set vitality
  calculateDamage() {
    const strength = this.playerForm.controls.strength.value;
    const vitality = strength + 3;
    const damage = this.playerForm.controls.damage.value != null ? parseInt(this.playerForm.controls.damage.value, 10) : vitality;
    const finalVaule = parseInt(vitality, 10) - damage;
    this.playerForm.controls.vitality.setValue(finalVaule);
  }
  // Export Attribute Value
  Export() {
    console.log(this.playerForm.value);
    alert('Successfully data has exported.');
  }
  // Import Attribute Value
  Import() {
    alert('Successfully data has imported.');
    console.log(this.playerForm.value);
  }
}
