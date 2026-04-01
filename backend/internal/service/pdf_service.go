package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/fonusa/k3-backend/internal/domain"
	"github.com/johnfercher/maroto/v2"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/config"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

type PDFService interface {
	GenerateWorkPermitPDF(ctx context.Context, permit *domain.WorkPermit) ([]byte, error)
	GenerateJSAPDF(ctx context.Context, jsa *domain.JSA) ([]byte, error)
	GeneratePatrolPDF(ctx context.Context, patrol *domain.PatrolK3) ([]byte, error)
}

type pdfService struct{}

func NewPDFService() PDFService {
	return &pdfService{}
}

func (s *pdfService) GenerateWorkPermitPDF(ctx context.Context, permit *domain.WorkPermit) ([]byte, error) {
	cfg := config.NewBuilder().
		WithPageSize("A4").
		Build()

	m := maroto.New(cfg)

	// Header
	m.AddRow(15,
		col.New(12).Add(
			text.New("PT. Fonusa Agung Mulia", props.Text{
				Top:   2,
				Style: fontstyle.Bold,
				Align: align.Center,
				Size:  14,
			}),
		),
	)
	m.AddRow(10,
		col.New(12).Add(
			text.New("SURAT IJIN KERJA - F.120.21.00.01 Rev.02", props.Text{
				Style: fontstyle.Bold,
				Align: align.Center,
				Size:  12,
			}),
		),
	)

	// Additional styling grids for permit omitted for brevity
	m.AddRow(15, col.New(12).Add(text.New(fmt.Sprintf("Permit ID: %s", permit.PermitNumber))))
	m.AddRow(15, col.New(12).Add(text.New(fmt.Sprintf("Status: %s", permit.Status))))

	document, err := m.Generate()
	if err != nil {
		log.Printf("Error generating PDF document: %v", err)
		return nil, err
	}

	return document.GetBytes(), nil
}

func (s *pdfService) GenerateJSAPDF(ctx context.Context, jsa *domain.JSA) ([]byte, error) {
	cfg := config.NewBuilder().
		WithPageSize("A4").
		Build()

	m := maroto.New(cfg)

	m.AddRow(15,
		col.New(12).Add(text.New("PT. Fonusa Agung Mulia", props.Text{Style: fontstyle.Bold, Align: align.Center, Size: 14})),
	)
	m.AddRow(10,
		col.New(12).Add(text.New("JOB SAFETY ANALYSIS (JSA) - F.120.01.00.11 Rev.01", props.Text{Style: fontstyle.Bold, Align: align.Center, Size: 12})),
	)

	m.AddRow(8,
		col.New(6).Add(text.New(fmt.Sprintf("No Job: %s", jsa.JobNumber))),
		col.New(6).Add(text.New(fmt.Sprintf("Nama Pekerjaan: %s", jsa.JobName))),
	)

	for _, step := range jsa.AnalysisSteps {
		m.AddRow(6, col.New(12).Add(text.New(fmt.Sprintf("%d. %s", step.Sequence, step.WorkStep), props.Text{Style: fontstyle.Bold})))
		m.AddRow(5, col.New(12).Add(text.New(fmt.Sprintf("   Sumber Bahaya: %s", step.HazardSource))))
		m.AddRow(5, col.New(12).Add(text.New(fmt.Sprintf("   Potensi Bahaya: %s", step.PotentialHazard))))
		m.AddRow(7, col.New(12).Add(text.New(fmt.Sprintf("   Upaya: %s", step.ControlMeasure))))
	}

	document, err := m.Generate()
	if err != nil {
		log.Printf("Error generating JSA PDF: %v", err)
		return nil, err
	}

	return document.GetBytes(), nil
}

func (s *pdfService) GeneratePatrolPDF(ctx context.Context, patrol *domain.PatrolK3) ([]byte, error) {
	cfg := config.NewBuilder().WithPageSize("A4").Build()
	m := maroto.New(cfg)

	m.AddRow(15, col.New(12).Add(text.New("PT. Fonusa Agung Mulia", props.Text{Style: fontstyle.Bold, Align: align.Center, Size: 14})))
	m.AddRow(10, col.New(12).Add(text.New("CHECKLIST PATROL K3", props.Text{Style: fontstyle.Bold, Align: align.Center, Size: 12})))

	m.AddRow(8, col.New(6).Add(text.New(fmt.Sprintf("No Patrol: %s", patrol.PatrolNumber))), col.New(6).Add(text.New(fmt.Sprintf("Tanggal: %s", patrol.Date.Format("02 Jan 2006")))))
	m.AddRow(8, col.New(6).Add(text.New(fmt.Sprintf("Area/Gedung: %s", patrol.Area))), col.New(6).Add(text.New(fmt.Sprintf("Petugas: %s", patrol.PatrolOfficer))))
	
	scoreStr := fmt.Sprintf("%d", patrol.TotalScore)
	if patrol.HasCritical {
		scoreStr += " (CRITICAL ALARM)"
	}
	m.AddRow(10, col.New(12).Add(text.New(fmt.Sprintf("Keselamatan Score: %s", scoreStr), props.Text{Style: fontstyle.Bold, Top: 2})))

	var categoriesMap map[string][]struct {
		Item  string `json:"item"`
		Score string `json:"score"`
		Note  string `json:"note"`
	}
	if err := json.Unmarshal(patrol.PatrolCategories, &categoriesMap); err == nil {
		for categoryName, items := range categoriesMap {
			m.AddRow(8, col.New(12).Add(text.New(categoryName, props.Text{Style: fontstyle.Bold, Top: 3})))
			for _, item := range items {
				line := fmt.Sprintf(" - %s : [ %s ]", item.Item, item.Score)
				if item.Note != "" {
					line += fmt.Sprintf(" (Catatan: %s)", item.Note)
				}
				m.AddRow(5, col.New(12).Add(text.New(line)))
			}
		}
	}

	document, err := m.Generate()
	if err != nil {
		log.Printf("Error generating Patrol PDF: %v", err)
		return nil, err
	}

	return document.GetBytes(), nil
}
