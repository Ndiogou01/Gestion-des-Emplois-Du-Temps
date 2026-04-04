package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;

@Entity
public class FiliereCours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private Filiere filiere;
    @ManyToOne
    private Cours cours;
    private Integer volumeHoraireTotal;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public Filiere getFiliere() {
        return filiere;
    }
    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public Cours getCours() {
        return cours;
    }
    public void setCours(Cours cours) {
        this.cours = cours;
    }


    public Integer getVolumeHoraireTotal() {
        return volumeHoraireTotal;
    }
    public void setVolumeHoraireTotal(Integer volumeHoraireTotal) {

        this.volumeHoraireTotal = volumeHoraireTotal;
    }
}
