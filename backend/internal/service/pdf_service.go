package service

import (
	"context"
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
			text.New("IJIN KERJA PEKERJAAN - F.120.21.00.01 Rev.02", props.Text{
				Style: fontstyle.Bold,
				Align: align.Center,
				Size:  12,
			}),
		),
	)

	// Info section
	m.AddRow(8,
		col.New(4).Add(text.New(fmt.Sprintf("No Izin: %s", permit.PermitNumber))),
		col.New(4).Add(text.New(fmt.Sprintf("Tanggal: %s", permit.Date.Format("02 Jan 2006")))),
		col.New(4).Add(text.New(fmt.Sprintf("Plant: %s", permit.Plant))),
	)

	m.AddRow(8,
		col.New(4).Add(text.New(fmt.Sprintf("Area: %s", permit.Area))),
		col.New(4).Add(text.New(fmt.Sprintf("Lokasi: %s", permit.Location))),
		col.New(4).Add(text.New(fmt.Sprintf("Subkon: %s", permit.Subcontractor))),
	)

	// Equipment and Personnel sections...
	m.AddRow(10, col.New(12).Add(text.New("Personil Terlibat:", props.Text{Style: fontstyle.Bold})))

	for _, p := range permit.ListPersonnel {
		m.AddRow(6,
			col.New(4).Add(text.New(p.Name)),
			col.New(8).Add(text.New(p.Role)),
		)
	}

	m.AddRow(10, col.New(12).Add(text.New("Peralatan:", props.Text{Style: fontstyle.Bold})))

	for _, eq := range permit.ListEquipments {
		m.AddRow(6,
			col.New(6).Add(text.New(fmt.Sprintf("%s - %s", eq.Type, eq.Name))),
			col.New(6).Add(text.New(fmt.Sprintf("Jumlah: %d", eq.Quantity))),
		)
	}

	m.AddRow(10, col.New(12).Add(text.New("Status & Persetujuan:", props.Text{Style: fontstyle.Bold, Top: 5})))
	m.AddRow(10, col.New(12).Add(text.New(fmt.Sprintf("Status: %s", permit.Status))))

	document, err := m.Generate()
	if err != nil {
		log.Printf("Error generating PDF document: %v", err)
		return nil, err
	}

	return document.GetBytes(), nil
}
